class DaysController < ApplicationController

  def create
    @user = User.find(session[:user_id]) if session[:user_id]

    unless @user.days.find_by(date: params[:day][:date])
      @day = Day.create(day_params) 
      @user.days << @day
    end
   
    respond_to do |format|
      if @day.save
        format.json { render json: @day}
      else
        format.json { render json: @day.errors, status: :unprocessable_entity }
      end
    end
  end 

  def index
    binding.pry
    @user = User.find(session[:user_id]) if session[:user_id]
    @days = @user.days
    render json: @days
  end

  def show
    @user = User.find(session[:user_id]) if session[:user_id]
    @locations = Day.find(params[:day][:id]).locations
    render json: @locations
  end

  def destroy

    @day = Day.find(day_params[:date])
    @day.destroy
    render json: {}
  end


  private

  def day_params
    params.require(:day).permit(:date, :user_id)
  end 

end