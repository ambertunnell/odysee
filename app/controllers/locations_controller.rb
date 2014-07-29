class LocationsController < ApplicationController

  def create
    @client = GooglePlaces::Client.new("AIzaSyAQYcSOCBKVx1L_UaJvnLSUs4oxDqkOeUk")

    @client.spots_by_query(params[:location][:name])

    @location = Location.new(location_params)

    @location.save
    redirect_to 'welcome/index'

  end


  private
    def location_params
      params.require(:location).permit(:name)
    end


end
