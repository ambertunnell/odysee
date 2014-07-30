class User < ActiveRecord::Base
  has_many :days 
  has_many :locations, :through => :days 
end
