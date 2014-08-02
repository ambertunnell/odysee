class LocationsController < ApplicationController

  def create
    @user     = User.find(session[:user_id]) if session[:user_id]
    @location = Location.new(location_params)
    @day      = Day.find(params[:location][:day_id])
    
    respond_to do |format|
      if @day.locations.size < 10
        @day.locations << @location
        format.json { render json: @location }
      else 
        format.json { render json: "There is a limit of 10 locations per day. Sorry!", status: :unprocessable_entity }
      end
    end
  end

  private

  def location_params
    params.require(:location).permit(:name, :latitude, :longitude, :day_id, :user_id)
  end 

end