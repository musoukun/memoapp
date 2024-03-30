# app/models/memo.rb
class Memo < ApplicationRecord
	before_create :generate_id
	belongs_to :user
	has_many :sections, dependent: :destroy
	has_many :tasks, through: :sections
	
	private
	def generate_id
		self.id = SecureRandom.uuid
	end
		
	# カラムに関するバリデーションや追加のロジックをここに記述
end