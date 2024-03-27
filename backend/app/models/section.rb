# app/models/section.rb
class Section < ApplicationRecord
	belongs_to :memo
	has_many :tasks, dependent: :destroy
	# カラムに関するバリデーションや追加のロジックをここに記述
end