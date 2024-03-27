class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :username
      t.string :password_digest

      t.timestamps
    end
  end
end

class CreateSections < ActiveRecord::Migration[6.0]
  def change
    create_table :sections do |t|
      t.references :memo, null: false, foreign_key: true
      t.string :title, default: ""

      t.timestamps
    end
  end
end

class CreateTasks < ActiveRecord::Migration[6.0]
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

class CreateMemos < ActiveRecord::Migration[6.0]
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

