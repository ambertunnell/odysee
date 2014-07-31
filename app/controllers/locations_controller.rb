class LocationsController < ApplicationController

  def index
    @location = Location.new
    @locations = Location.all
    @day = Day.new
    @days = Day.all 

  end

  def create
    @location = Location.new(location_params)

    if @location.save
      redirect_to root_url
    end   

  end

  private

  def location_params
    params.require(:location).permit(:name, :latitude, :longitude, :day_id)
  end 

end