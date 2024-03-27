class ApplicationController < ActionController::API

	def authenticate_request
		# リクエストヘッダーからAuthorizationを取得します
		header = request.headers['Authorization']
		# トークンがBearer形式であることを想定して、スペースで分割しトークン部分を取得します
		header = header.split(' ').last if header
		begin
		# JWTライブラリを使用してトークンをデコードします
		@decoded = JWT.decode(header,  Rails.application.credentials.secret_key_base)[0]
		# デコードされたトークンからユーザーIDを取得し、ユーザーを検索します
		@current_user = User.find(@decoded['user_id'])
		rescue ActiveRecord::RecordNotFound, JWT::DecodeError
		# ユーザーが見つからない、またはトークンが無効な場合はエラーレスポンスを返します
		render json: { errors: 'Unauthorized' }, status: :unauthorized
		end
	end

	def verify_token
		# トークンを検証するためのアクションです
		header = request.headers['Authorization']
		# トークンが提供されていない場合は、エラーを返します
		return render json: { error: 'Token not provided' }, status: :forbidden unless header

		token = header.split(' ').last
		begin
		decoded_token = JWT.decode(token,  Rails.application.credentials.secret_key_base, true, algorithm: 'HS256')
		user_id = decoded_token[0]['user_id']
		user = User.find(user_id)
		# トークンが有効であればユーザー情報を返します
		render json: { user: user.as_json(only: [:id, :username]) }, status: :ok
		rescue JWT::DecodeError
		# トークンが無効である場合はエラーを返します
		render json: { error: 'Invalid token' }, status: :unauthorized
		end
	end
end

