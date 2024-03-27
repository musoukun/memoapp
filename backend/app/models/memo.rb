# app/models/memo.rb
class Memo < ApplicationRecord
	belongs_to :user
	has_many :sections, dependent: :destroy
	has_many :tasks, through: :sections
  
	# カラムに関するバリデーションや追加のロジックをここに記述
  end