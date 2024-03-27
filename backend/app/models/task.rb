# app/models/task.rb
class Task < ApplicationRecord
	belongs_to :section

	# カラムに関するバリデーションや追加のロジックをここに記述
end
