Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'up' => 'rails/health#show', as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  namespace :api do
    post '/memos', to: 'memos#create'
    get '/memos', to: 'memos#index'
    get '/memos/:id', to: 'memos#show'

    # 既存のリソース定義にputも追加
    #resources :memos, only: [:update]は、memosリソースに対する標準のRESTfulアクションのうち
    # updateアクションのみを利用することを指定しています。
    # この時点で、RailsはPATCH /memos/:idというルートを自動的に生成します。
    resources :memos, only: [:update] do
      member do
        patch :update
        put :update

        # patch :updateとput :updateは、それぞれ
        # PATCH /memos/:id
        # PUT /memos/:idという
        # ルートを明示的に定義します。
        
        # 特定のidを持つメモを更新するためのリクエストとして、両方のHTTPメソッドが許可されます。
      end
    end

    namespace :auth do
      post '/register', to: 'registrations#create'
      post '/login', to: 'sessions#create'
      post '/verify-token', to: 'auth#verify_token'
    end

  end
end
