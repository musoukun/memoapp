
class ApplicationController < ActionController::API
  def verify_token
    authorization_header = request.headers[:authorization]
    # logger.debug("header: #{authorization_header}")
    unless authorization_header
      logger.debug('Token not provided')
      return render json: { error: 'Token not provided' }, status: :forbidden
    end

    token = authorization_header.split(' ').last
    secret_key = Rails.application.credentials.secret_key_base
    # logger.debug("token: #{token}")
    # logger.debug("secret_key: #{secret_key}");
    begin
      decoded_token = JWT.decode(token, secret_key, true, { algorithm: 'HS256' })
      # logger.debug("decoded_token: #{decoded_token}");
      user_id = decoded_token[0]['user_id']
      # logger.debug("user_id: #{user_id}");
      @current_user = User.find(user_id)
    rescue ActiveRecord::RecordNotFound, JWT::DecodeError
      render_unauthorized
      logger.debug('RecordNotFound or DecodeError')
    end
  end

  def authenticate_request
    # リクエストヘッダーからAuthorizationを取得します
    header = request.headers['Authorization']
    # トークンがBearer形式であることを想定して、スペースで分割しトークン部分を取得します
    header = header.split(' ').last if header
    begin
      # JWTライブラリを使用してトークンをデコードします
      @decoded = JWT.decode(header, Rails.application.credentials.secret_key_base)[0]
      # デコードされたトークンからユーザーIDを取得し、ユーザーを検索します
      @current_user = User.find(@decoded['user_id'])
    rescue ActiveRecord::RecordNotFound, JWT::DecodeError
      # ユーザーが見つからない、またはトークンが無効な場合はエラーレスポンスを返します
      render json: { errors: 'Unauthorized' }, status: :unauthorized
    end
  end

  def render_unauthorized
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end
end
