define(["exports","./../modules/emby-apiclient/connectionmanager.js","./../modules/common/playback/playbackmanager.js","./../modules/common/textencoding.js","./../modules/listview/listview.js","./../modules/registrationservices/registrationservices.js","./../modules/common/globalize.js","./../modules/common/inputmanager.js","./../modules/layoutmanager.js","./../modules/emby-elements/emby-scroller/emby-scroller.js","./../modules/emby-elements/emby-itemscontainer/emby-itemscontainer.js"],function(_exports,_connectionmanager,_playbackmanager,_textencoding,_listview,_registrationservices,_globalize,_inputmanager,_layoutmanager,_embyScroller,_embyItemscontainer){function normalizeTrackEvents(trackEvents,item,apiClient){for(var i=0,length=trackEvents.length;i<length;i++){var trackEvent=trackEvents[i];trackEvent.Id=item.Id+"_lyrics_"+i,trackEvent.Type="LyricsLine",trackEvent.ServerId=apiClient.serverId()}}function LyricsRenderer(options){var options=(this.options=options).parent,itemsContainer=(_inputmanager.default.on(options,function(e){switch(e.detail.command){case"up":case"down":this.lastDirectionalInput=Date.now(),e.stopPropagation();break;case"left":case"right":e.stopPropagation()}}.bind(this)),!function(parent){var html="",allownativesmoothscroll=!_layoutmanager.default.tv;parent.innerHTML=html+('<div is="emby-scroller" class="flex flex-grow lyricsScroller" data-mousewheel="true" data-horizontal="false" data-forcescrollbar="true" data-centerfocus="true" data-allownativesmoothscroll="'+allownativesmoothscroll+'">')+'<div is="emby-itemscontainer" class="focuscontainer scrollSlider flex-grow flex-direction-column vertical-list itemsContainer osdLyricsItemsContainer padded-left padded-right">'+"</div>"+"</div>"}(options),options.querySelector(".osdLyricsItemsContainer"));itemsContainer.fetchData=function(query){return this.getItemsInternal().then(function(items){var totalRecordCount=items.length;return{TotalRecordCount:totalRecordCount,Items:items}})}.bind(this),itemsContainer.virtualChunkSize=30,itemsContainer.getListOptions=function(items){return{renderer:_listview.default,options:{fields:["Text","LyricsTime"],action:"seektoposition",image:!1,moreButton:!1,highlight:!1,verticalPadding:!1,multiSelect:!1,contextMenu:!1,mediaInfo:!1,enableUserDataButtons:!1,draggable:!1,itemClass:"lyricsItem secondaryText"},virtualScrollLayout:"vertical-grid"}}.bind(this),this.itemsContainer=itemsContainer,this.currentIndex=-1,this.scroller=options.querySelector(".lyricsScroller")}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,require(["css!videoosd/lyrics.css"]),LyricsRenderer.prototype.getItemsInternal=function(){this.needsRefresh=!1;var item=this.currentItem;if(!item)return Promise.resolve([]);var apiClient=_connectionmanager.default.getApiClient(item),mediaSource=item.MediaSources[0];if(!mediaSource)return Promise.resolve([]);var track=mediaSource.MediaStreams.filter(function(t){return"Subtitle"===t.Type&&t.Index===mediaSource.DefaultSubtitleStreamIndex})[0];if(!track)return Promise.resolve([]);return _registrationservices.default.validateFeature("dvr",{showDialog:!1,viewOnly:!0}).then(function(){var url=apiClient.getUrl("Items/"+item.Id+"/"+mediaSource.Id+"/Subtitles/"+track.Index+"/Stream.js",{});return apiClient.getJSON(url).then(function(result){result=result.TrackEvents;return normalizeTrackEvents(result,item,apiClient),result})},function(){return function(item,apiClient){var trackEvents=[];return trackEvents.push({Text:_globalize.default.translate("Lyrics")}),trackEvents.push({Text:_globalize.default.translate("MessageUnlockAppWithSupporter")}),normalizeTrackEvents(trackEvents,item,apiClient),trackEvents}(item,apiClient)})},LyricsRenderer.prototype.onPlaybackStopped=function(){},LyricsRenderer.prototype.pause=function(){this.paused=!0,this.itemsContainer&&this.itemsContainer.pause&&this.itemsContainer.pause()},LyricsRenderer.prototype.focus=function(){this.selectedElement&&this.selectedElement.focus()},LyricsRenderer.prototype.resume=function(options){this.paused=!1,this.itemsContainer.resume?this.itemsContainer.resume():this.itemsContainer.addEventListener("upgraded",function(e){e.target.resume(this)}.bind(options)),null!=this.currentTime&&this.onTimeUpdate(this.currentTime)},LyricsRenderer.prototype.refreshEvents=function(events){this.itemsContainer.refreshItems()},LyricsRenderer.prototype.updateItem=function(item){var changed=this.currentItem!==item;this.currentItem=item,changed&&this.itemsContainer.notifyRefreshNeeded(!0)},LyricsRenderer.prototype.onTimeUpdate=function(positionTicks,runtimeTicks){if(this.currentTime=positionTicks,!this.paused){var itemsContainer=this.itemsContainer;if(itemsContainer){var items=itemsContainer.getItems();if(items){for(var index=-1,i=0,length=items.length;i<length;i++){var item=items[i];if(null!=item.StartPositionTicks)if(positionTicks>=item.StartPositionTicks)index=i;else if(-1!==index)break}var children,previousIndex=this.currentIndex;index!==previousIndex&&(children=itemsContainer.children,previousIndex=-1===previousIndex?null:children[previousIndex],children=-1===(this.currentIndex=index)?null:children[index],previousIndex&&(previousIndex.classList.remove("lyricsItem-selected"),previousIndex.offsetWidth),this.selectedElement=children,Date.now()-(this.lastDirectionalInput||0)<2e3||children&&(children.classList.add("lyricsItem-selected"),children!==document.activeElement&&(_layoutmanager.default.tv?itemsContainer.scrollToIndex(index,{},!0):(previousIndex=this.scroller)&&previousIndex.toStart(children,{offset:-60}))))}}}},LyricsRenderer.prototype.destroy=function(){var options=this.options;options&&(options=options.parent)&&(options.innerHTML="",options.classList.add("hide")),this.currentItem=null,this.currentTime=null,this.paused=null,this.options=null,this.itemsContainer=null,this.scroller=null,this.currentIndex=null,this.lastDirectionalInput=null,this.selectedElement=null},_exports.default=LyricsRenderer});