class Day < ActiveRecord::Base
  has_many   :locations 
  belongs_to :user

  validates_uniqueness_of :date
end
