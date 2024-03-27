module Api
	module Auth
		class AuthController < ApplicationController

			def verify_token
				authorization_header = request.headers[:authorization]
				logger.debug("header: #{authorization_header}");
				unless authorization_header
					logger.debug("Token not provided");
					return render json: { error: 'Token not provided' }, status: :forbidden
				end
				
				token = authorization_header.split(' ').last
				secret_key = Rails.application.credentials.secret_key_base
				# logger.debug("token: #{token}");
				# logger.debug("secret_key: #{secret_key}");
				begin
					decoded_token = JWT.decode(token, secret_key, true, { algorithm: 'HS256' })
					# logger.debug("decoded_token: #{decoded_token}");
					user_id = decoded_token[0]['user_id']
					# logger.debug("user_id: #{user_id}");
					@current_user = User.find(user_id)
					# logger.debug("current_user: #{@current_user}");
					render json: { user: @current_user.as_json(only: [:id, :username]) }, status: :ok
				rescue ActiveRecord::RecordNotFound, JWT::DecodeError
					render_unauthorized
					logger.debug("RecordNotFound or DecodeError");
				end
			end

			private

			def render_unauthorized
				render json: { errors: 'Unauthorized' }, status: :unauthorized
			end
		end
	end
end
