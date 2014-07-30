class LocationsController < ApplicationController

  def index
  end

  def create
    @client = GooglePlaces::Client.new("AIzaSyAQYcSOCBKVx1L_UaJvnLSUs4oxDqkOeUk")

    query = params[:query]

    lat = @client.spots_by_query(query).first.lat
    lng = @client.spots_by_query(query).first.lng
    
    @location = Location.new(:latitude => lat, :longitude => lng)

    if @location.save

      @hash = Gmaps4rails.build_markers(@location) do |location, marker|
        marker.lat location.latitude
        marker.lng location.longitude
      end.first

      render 'welcome/index'
    end   

  end


end
