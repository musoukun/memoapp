# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_04_02_150324) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "memos", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "icon", default: "📝"
    t.string "title", default: "無題"
    t.json "description", default: "{}"
    t.integer "position"
    t.boolean "favorite", default: false
    t.integer "favorite_position", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_memos_on_user_id"
  end

  create_table "sections", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "memo_id", null: false
    t.string "title", default: ""
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["memo_id"], name: "index_sections_on_memo_id"
  end

  create_table "tasks", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "section_id", null: false
    t.string "title", default: ""
    t.text "content", default: ""
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["section_id"], name: "index_tasks_on_section_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "username"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "memos", "users"
  add_foreign_key "sections", "memos"
  add_foreign_key "tasks", "sections"
end
