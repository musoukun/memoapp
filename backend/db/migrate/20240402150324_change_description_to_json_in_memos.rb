class ChangeDescriptionToJsonInMemos < ActiveRecord::Migration[7.1]
  def up
    # PostgreSQLでは、カラムタイプ変更時にデフォルト値のキャストが必要です。
    # まず、デフォルト値を削除します。
    change_column_default :memos, :description, from: "ここに自由に記入してください", to: nil

    # 次に、カラムの型をtextからjsonに変更します。
    change_column :memos, :description, :json, using: 'description::json'

    # 最後に、新しいデフォルト値をjson形式で設定します。
    change_column_default :memos, :description, from: nil, to: '{}'
  end

  def down
    # ロールバック時の処理です。
    change_column_default :memos, :description, from: '{}', to: nil
    change_column :memos, :description, :text, using: 'description::text'
    change_column_default :memos, :description, from: nil, to: "ここに自由に記入してください"
  end
end
