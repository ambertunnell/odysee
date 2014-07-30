class LocationsController < ApplicationController

  def index
    @location = Location.new
    @locations = Location.all

  end

  def create
    @client = GooglePlaces::Client.new("AIzaSyAQYcSOCBKVx1L_UaJvnLSUs4oxDqkOeUk")

    query = params[:query]

    lat = @client.spots_by_query(query).first.lat
    lng = @client.spots_by_query(query).first.lng
    
    @location = Location.new(:latitude => lat, :longitude => lng)

    if @location.save
      redirect_to root_url
    end   

  end


end
