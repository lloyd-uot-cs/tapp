class ImportController < ApplicationController
  protect_from_forgery with: :null_session

  def chass
    import = ChassImporter.new(params[:chass_json])
    status = import.get_status
    if status[:success]
      render json: {message: status[:message]}
    else
      render status: 404, json: {message: status[:message]}.to_json
    end
  end
end
