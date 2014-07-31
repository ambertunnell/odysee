class LocationsController < ApplicationController

  def create
    @user = User.find(session[:user_id]) if session[:user_id]
    @location = Location.new(location_params)
    @day = Day.find(params[:location][:day_id])
    @day.locations << @location
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
    params.require(:location).permit(:name, :latitude, :longitude, :day_id, :user_id)
  end 

end