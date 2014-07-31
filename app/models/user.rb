class User < ActiveRecord::Base
  has_many :days 
  has_many :locations, :through => :days

  def self.create_from_omniauth(auth_hash)
    self.create(provider: auth_hash[:provider],
    uid: auth_hash[:uid],
    name: auth_hash[:info][:name])
  end 
  
end
