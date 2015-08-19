require 'bundler'
Bundler.require

ActiveRecord::Base.establish_connection(
  :adapter => 'postgresql',
  :database => 'testdb1'
)

get '/' do
  erb :index
end

get '/1' do
  erb :one
end

get '/2' do
  erb :two
end

get '/3' do
  erb :three
end
