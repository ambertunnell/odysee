class LocationsController < ApplicationController

  def index
    @location = Location.new
    @locations = Location.all
    @day = Day.new
    @days = Day.all 
    
    # @day_locations = Day.first.locations
    # render json: @day_locations
  end

  def create
    @location = Location.new(location_params)

    if @location.save
      redirect_to root_url
    end   
  end

  # def destroy
  #   @location = Location.where(:latitude => params[:latitude], :longitude => params[:longitude], :day_id => params[:day_id]).first
  #   if @location.destroy
  #     redirect_to root_url
  #   end    
  # end

  private

  def location_params
    params.require(:location).permit(:name, :latitude, :longitude, :day_id)
  end 

end