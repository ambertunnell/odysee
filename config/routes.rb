Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".
  
  root 'users#show'

  get '/login' => 'sessions#new'
  get '/auth/facebook/callback' => 'sessions#create'
  get '/logout' => 'sessions#destroy'
  post 'days/destroy_locations' 

  resources :locations, :only => [:index, :create]
  resources :days, :only => [:index, :create, :show, :destroy]
  resources :users

end
