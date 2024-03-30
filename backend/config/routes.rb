Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'up' => 'rails/health#show', as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  namespace :api do
    post '/memo', to: 'memos#create'
    get '/memo', to: 'memos#index'
    get '/memo/:id', to: 'memos#show'
    namespace :auth do
      post '/register', to: 'registrations#create'
      post '/login', to: 'sessions#create'
      post '/verify-token', to: 'auth#verify_token'
    end
  end
end
