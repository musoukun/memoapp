class User < ApplicationRecord
	validates :username, presence: true, uniqueness: { case_sensitive: false, message: 'すでにユーザ名が存在しています。' }
	validates :password, presence: true #, length: { minimum: 6 }
	has_many :memos, dependent: :destroy
	has_secure_password
end