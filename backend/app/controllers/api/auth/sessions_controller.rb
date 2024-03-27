module Api
	module Auth
		class SessionsController < ApplicationController
			# CSRFトークンの検証をスキップします。APIでは一般的に不要です。
			skip_before_action :verify_authenticity_token, raise: false
			
			def create
				# ユーザー認証のためのcreateアクション。usernameとpasswordをリクエストから取得します。
				
				# リクエストの"user"キーからusernameを取得します。
				user = User.find_by(username: params[:user][:username])
				
				# ユーザーが存在し、かつパスワードが正しい場合
				if user && user.authenticate(params[:user][:password])
					# JWTトークンを生成。ユーザーIDと有効期限をペイロードに含めます。
					token = JWT.encode(
						{ user_id: user.id, exp: 24.hours.from_now.to_i },
						Rails.application.credentials.secret_key_base
					)
					logger.debug("返却するtoken: #{token}")
					# 生成したJWTトークンをレスポンスとして返します。
					render json: { token: token }, status: :ok
				else
					# ユーザー名またはパスワードが無効な場合はエラーメッセージを返します。
					render json: { error: 'Invalid username or password' }, status: :unauthorized
				end
			end
			
		end
	end
end
