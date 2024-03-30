module Api
  module Auth
    class RegistrationsController < ApplicationController
      def create
        user = User.new(user_params)
        if user.save
          logger.debug('ユーザーの保存に成功しました.')
          logger.debug("status: #{status}")
          render json: user, status: :created
        else
          render json: { errors: user.errors.messages }, status: :unprocessable_entity
        end
      end

      private

      def user_params
        params.require(:user).permit(:username, :password, :password_confirmation)
      end
    end
  end
end
