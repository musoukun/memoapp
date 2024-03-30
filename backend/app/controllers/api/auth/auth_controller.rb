module Api
  module Auth
    class AuthController < ApplicationController
      before_action :verify_token

      def verify_token
        super
        # 認証が成功した場合の追加処理を記載予定（必要に応じて）
        render json: { user: @current_user.as_json(only: %i[id username]) }, status: :ok
      end

      # private

      # def render_unauthorized
      # 	render json: { errors: 'Unauthorized' }, status: :unauthorized
      # end
    end
  end
end
