class Day < ActiveRecord::Base
  has_many   :locations, dependent: :destroy
  belongs_to :user
  #validates presence of date
end
