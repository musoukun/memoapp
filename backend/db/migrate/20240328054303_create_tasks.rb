class CreateTasks < ActiveRecord::Migration[7.1]
  def change
    create_table :tasks do |t|
      t.references :section, null: false, foreign_key: true
      t.string :title, default: ""
      t.text :content, default: ""
      t.integer :position
      t.timestamps
    end
  end
end
