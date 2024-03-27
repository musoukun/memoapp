class CreateMemos < ActiveRecord::Migration[7.1]
  def change
    create_table :memos do |t|
      t.references :user, null: false, foreign_key: true
      t.string :icon, default: "📝"
      t.string :title, default: "無題"
      t.text :description, default: "ここに自由に記入してください"
      t.integer :position
      t.boolean :favorite, default: false
      t.integer :favorite_position, default: 0

      t.timestamps
    end
  end
end