class CreateSections < ActiveRecord::Migration[7.1]
  def change
    create_table :sections, id: :uuid do |t|
      t.references :memo, null: false, foreign_key: true, type: :uuid
      t.string :title, default: ""

      t.timestamps
    end
  end
end