class LocationsController < ApplicationController

  def index
    @location = Location.new
    @locations = Location.all
    @days = Day.all 

  end

  def create


    # @location = Location.new(:latitude => lat, :longitude => lng)

    # if @location.save
    #   redirect_to root_url
    # end   

  end

  private

  def location_params
    params.require(:location).permit(:name, :day => [:day_id])
  end 

end