class UsersController < ApplicationController
  def new
  end

  def create

    # @user = User.find_or_create_by(user_params)
    # if @user.persisted?
    #   session[:user_id] = @user.id
    #   redirect_to '/'
    # else
    #    redirect_to '/', :notice => "Please Try to Log in Again!"
    # end
  end

  def destroy
  end

  def update
    @user = User.find_by(id: session[:user_id])
  end

  def show
    @day = Day.new
    @location = Location.new 
    if session[:user_id]
      @user = User.find(session[:user_id]) 
      @locations = @user.locations
      @days = @user.days
    end
  end

  private
    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      params.require(:user).permit(:name, :uid)
    end
end
