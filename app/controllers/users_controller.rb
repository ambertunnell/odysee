class UsersController < ApplicationController
  def new
  end

  def create
    @user = User.find_by(id: session[:user_id])
  end

  def destroy
  end

  def update
    @user = User.find_by(id: session[:user_id])
  end

  def show
    @location = Location.new
    @locations = Location.all
    @day = Day.new
    @days = Day.all 
  end
  
end
