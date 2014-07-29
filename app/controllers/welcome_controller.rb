class WelcomeController < ApplicationController
  
  def index
    @location = Location.new
  end
end
