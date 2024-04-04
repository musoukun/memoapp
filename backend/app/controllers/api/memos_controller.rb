module Api
  class MemosController < ApplicationController
    before_action :verify_token
    # set_memoメソッドをbefore_actionでupdateアクションに適用しています。
    # これにより、updateアクションが呼び出される前に、更新しようとしているmemoインスタンスが@memo変数にセットされます。
    before_action :set_memo, only: [:update, :destroy] # set_memoをupdateとdestroyアクションに適用


    def create
      memo_count = Memo.count
      logger.debug("creatememo")
      memo = Memo.new(user_id: @current_user.id, position: memo_count)
      # logger.debug("memo: #{memo}")
      if memo.save
        render json: memo, status: :created
        logger.debug("memo: #{memo}")
      else
        logger.debug("memo.errors: #{memo.errors}")
        render json: memo.errors, status: :unprocessable_entity
      end
    rescue StandardError => e
      logger.debug("error: #{e.message}")
      render json: { error: e.message }, status: :internal_server_error
    end

    def index
      logger.debug("current_user: #{@current_user}")
      memos = @current_user.memos.order(position: :desc)
      logger.debug("memos: #{memos}")
      render json: memos, status: :ok
    end

    def update_position
      params[:memos].reverse.each_with_index do |memo, index|
        @current_user.memos.find(memo[:id]).update(position: index)
      end
      render json: { message: '更新しました' }, status: :ok
    rescue StandardError => e
      render json: { error: e.message }, status: :internal_server_error
    end

    def show
      @memo = @current_user.memos.find(params[:id])
      render json: @memo
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'メモが存在しません' }, status: :not_found
    end

    def update
      logger.debug("update")
      logger.debug(memo_params)
    
      @memo.title = memo_params[:title].blank? ? "無題" : memo_params[:title]
      @memo.description = memo_params[:description].blank? ? "ここに自由に記入してください" : memo_params[:description]
    
      if memo_params[:favorite].present? && @memo.favorite != memo_params[:favorite]
        favorites = Memo.where(user_id: @memo.user_id, favorite: true).where.not(id: @memo.id)
    
        if memo_params[:favorite]
          @memo.favorite_position = favorites.count
        else
          favorites.each_with_index do |memo, index|
            memo.update(favorite_position: index)
          end
        end
      end
    
      if @memo.update(memo_params)
        render json: @memo
      else
        render json: @memo.errors, status: :unprocessable_entity
      end
    end

    def favorites
      favorites = @current_user.memos.where(favorite: true).order(favorite_position: :desc)
      render json: favorites, status: :ok
    rescue StandardError => e
      render json: { error: e.message }, status: :internal_server_error
    end

    def destroy
      @memo.destroy
      render json: { message: 'メモを削除しました' }, status: :ok
    end

    private

    def set_memo
      @memo = Memo.find(params[:id])
    end
    
    # memo_paramsメソッドを定義して、title, description, favoriteといったパラメータのうち
    # 許可されたものだけがupdateメソッドによって更新されるようにしています。
    # このメソッドはupdateアクション内で呼び出される。
    def memo_params
      params.require(:memo).permit(:title, :description, :favorite) # ここに許可するパラメータを追加
    end

    def render_unauthorized
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end

    # def verify_token
    #   super
    # end

  end
end
