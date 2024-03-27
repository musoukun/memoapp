module Api
	class MemoController < ApplicationController
		
		module Api
			class MemoController < ApplicationController
				
				helper_method :current_user
				
				def create
					begin
						# メモの総数を取得
						memo_count = Memo.count
						logger.debug("memo_count: #{memo_count}")
						# 新しいメモを作成
						logger.debug("current_user: #{current_user.inspect}")
						memo = Memo.new(user_id: current_user.id, position: memo_count)
						logger.debug("memo: #{memo.inspect}")
						if memo.save
							logger.debug("memo saved")
							# 保存に成功した場合、201 Createdでメモを返す
							render json: memo, status: :created
						else
							# 保存に失敗した場合、エラーメッセージを返す
							render json: memo.errors, status: :unprocessable_entity
						end
					rescue => e
						# 予期せぬエラーの場合、500 Internal Server Errorを返す
						render json: { error: e.message }, status: :internal_server_error
					end
				end
		
				private
			
				def current_user
					@current_user ||= User.find(session[:user_id]) if session[:user_id]
				rescue ActiveRecord::RecordNotFound
					session[:user_id] = nil
				end
			end
		end
		
	end
end
