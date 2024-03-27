class CreateSections < ActiveRecord::Migration[7.1]
  def change
    create_table :sections do |t|
      t.references :memo, null: false, foreign_key: true
      t.string :title, default: ""

      t.timestamps
    end
  end
end