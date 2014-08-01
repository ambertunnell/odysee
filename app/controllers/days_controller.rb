class DaysController < ApplicationController

  def create
    # binding.pry
    @user = User.find(session[:user_id]) if session[:user_id]
    @day = Day.new(day_params)
    @user.days << @day
    respond_to do |format|
      if @day.save
        # format.html { redirect_to root_url, notice: 'Day was successfully created.' }
        format.json { render json: @day}
      else
        # format.html { redirect_to root_url, notice: 'Day could not be created.' }
        format.json { render json: @day.errors, status: :unprocessable_entity }
      end
    end
  end 

  def show
    @user = User.find(session[:user_id]) if session[:user_id]
    @locations = Day.find(params[:day][:id]).locations
    render json: @locations
  end

  def destroy
    # binding.pry
    @day = Day.find(day_params[:date])
    @day.destroy
    render json: {}
  end


  private

  def day_params
    params.require(:day).permit(:date, :user_id)
  end 

end