class Day < ActiveRecord::Base
  has_many   :locations, dependent: :destroy
  belongs_to :user

  validates_uniqueness_of :date
end
