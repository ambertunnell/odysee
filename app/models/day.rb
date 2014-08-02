class Day < ActiveRecord::Base
  has_many   :locations, dependent: :destroy
  belongs_to :user
  validates_presence_of :date
end
