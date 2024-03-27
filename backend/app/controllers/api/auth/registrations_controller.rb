module Api
	module Auth
		# RegistrationsControllerクラスを定義しています。ApplicationControllerを継承しており、
		# このクラス内で定義されたアクションは、すべてのコントローラーで共通の機能（例えば認証）を利用できます。
		class RegistrationsController < ApplicationController
		# createアクションを定義しています。このアクションは、新しいユーザーを登録するために使用されます。
		def create
			# Userモデルのインスタンスを新規作成しています。user_paramsメソッドから得られたパラメータを使用しています。
			user = User.new(user_params)
			if user.save
				# ユーザーの保存に成功した場合、保存されたユーザーの情報をJSON形式でクライアントに返し、
				# HTTPステータスコードとして201（Created）を返します。
				logger.debug("ユーザーの保存に成功しました.")
				logger.debug("status: #{status}")
				render json: user, status: :created
			else
				# ユーザーの保存に失敗した場合、エラーメッセージをJSON形式でクライアントに返し、
				# HTTPステータスコードとして422（Unprocessable Entity）を返します。
				render json: { errors: user.errors.messages }, status: :unprocessable_entity
			end
		end
	
			private
			# 以下はprivateメソッドの定義部分です。この下に定義されたメソッドは、クラスの外部からは直接呼び出すことができません。
	
		# user_paramsメソッドを定義しています。このメソッドは、ストロングパラメータを使用して、
		# ユーザー作成時に許可されたパラメータ（username, password, password_confirmation）のみを
		# 取り出すために使用されます。これにより、不正なパラメータによる脆弱性を防ぎます。
		def user_params
			params.require(:user).permit(:username, :password, :password_confirmation)
			end
		end
	end
end