class DropTables < ActiveRecord::Migration[7.1]
  class DropTables < ActiveRecord::Migration[6.0]
    def change
      drop_table :users if table_exists?(:users)
      drop_table :memos if table_exists?(:memos)
      drop_table :sections if table_exists?(:sections)
      drop_table :tasks if table_exists?(:tasks)
    end
  end
end
