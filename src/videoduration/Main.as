package {
	
	import flash.display.MovieClip;
	import flash.events.AsyncErrorEvent;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.NetStatusEvent;
	import flash.events.SecurityErrorEvent;
	import flash.external.ExternalInterface;
	import flash.media.SoundTransform;
	import flash.media.Video;
	import flash.net.NetConnection;
	import flash.net.NetStream;
	
	public class Main extends MovieClip {
		// ===================================================================
		// Properties
		// -------------------------------------------------------------------
		
		private var _videoUrl:String;
		private var _callbackFunc:String;	
		private var _index:Number;
		
		private var _video:Video;
		
		private var _netConnection:NetConnection;
		private var _netStream:NetStream;
		
		// ===================================================================
		// Constructor
		// -------------------------------------------------------------------
		
		public function Main():void {
			addEventListener(Event.ADDED_TO_STAGE, addedToStageHandler, false, 0, true);
		}
		
		// ===================================================================
		// Private Methods
		// -------------------------------------------------------------------
		
		private function respond (p_duration:Number, p_error:String):void {
			if (_netConnection) {
				_netConnection.close();
				_netConnection.removeEventListener(NetStatusEvent.NET_STATUS, netStatusHandler, false);
				_netConnection.removeEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler, false);
				_netConnection.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler, false);
			}
			if (_netStream) {
				_netStream.close();
				_netStream.removeEventListener(NetStatusEvent.NET_STATUS, netStatusHandler, false);
				_netStream.removeEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler, false);
				_netStream.removeEventListener(AsyncErrorEvent.ASYNC_ERROR, asyncErrorHandler, false);
			}
			if (_video) {
				_video.clear();
			}
			if (ExternalInterface.available) {
				if (p_error) {
					ExternalInterface.call('console.log', p_error);
				}
				ExternalInterface.call(_callbackFunc, _index, p_duration);
			}
		}
		
		// ===================================================================
		// Event Handlers
		// -------------------------------------------------------------------
		
		private function addedToStageHandler (p_event:Event):void {
			removeEventListener(Event.ADDED_TO_STAGE, addedToStageHandler, false);
			_videoUrl = root.loaderInfo.parameters.url;
			_callbackFunc = root.loaderInfo.parameters.callback;
			var index = root.loaderInfo.parameters.index;
			if (index) _index = parseInt(index);
			if ( ! _index) _index = 0;
			if (_videoUrl && _callbackFunc) {
				if (ExternalInterface.available) {
					_netConnection = new NetConnection();
					_netConnection.addEventListener(NetStatusEvent.NET_STATUS, netStatusHandler, false, 0, true);
					_netConnection.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler, false, 0, true);
					_netConnection.addEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler, false, 0, true);
					_netConnection.connect(null);
				} else {
					respond(0, 'External Interface Not Available');
				}
			} else {
				respond(0, 'Invalid Arguments');
			}
		}
		private function netStatusHandler (p_event:NetStatusEvent):void {
			switch (p_event.info.code) {
				case 'NetConnection.Connect.Success':
					_netStream = new NetStream(_netConnection);
					_netStream.addEventListener(NetStatusEvent.NET_STATUS, netStatusHandler, false, 0, true);
					_netStream.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler, false, 0, true);
					_netStream.addEventListener(AsyncErrorEvent.ASYNC_ERROR, asyncErrorHandler, false, 0, true);
					_netStream.client = this;
					_netStream.soundTransform = new SoundTransform(0);
					_video = new Video();
					_video.attachNetStream(_netStream);
					_netStream.play(_videoUrl);
					//addChild(_video);
					break;
				case 'NetStream.Play.StreamNotFound':
					respond(0, 'Stream Not Found');
					break;
			}
		}
		private function ioErrorHandler (p_event:IOErrorEvent):void {
			respond(0, 'IO Error');
		}
		private function securityErrorHandler (p_event:SecurityErrorEvent):void {
			respond(0, 'Security Violation');
		}
		private function asyncErrorHandler (p_event:AsyncErrorEvent):void {
			respond(0, 'Asynchronous Error');
		}
		
		// ===================================================================
		// NetStream Client Methods
		// -------------------------------------------------------------------
		
		public function onMetaData (p_metaData:Object):void {
			respond(p_metaData.duration, null);
		}
		
		// -------------------------------------------------------------------
	}
}