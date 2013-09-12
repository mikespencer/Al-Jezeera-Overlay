var wpAd = wpAd || {};

(function($){

  'use strict';

  var defaults = {
    clickTrack: '',
    clickTrackEsc: '',
    auto: true,
    autoCloseTimeout: 7000,
    minFlashVer: 9,
    container: '.ajam-overlay-container',
    hpContainer: '.ajam-overlay-hp',
    overlayContainer: '.ajam-overlay-overlay',
    tracking: {
      expand: '',
      collapse: ''
    },
    creative: {
      halfpage: {
        url: '',
        id: 'ajam_hp',
        width: '300',
        height: '600',
        clickTag: [''],
        backup: ''
      },
      overlay: {
        url: '',
        id: 'ajam_overlay',
        width: '1000',
        height: '600',
        clickTag: ['']
      }
    }
  };

  var flashver = (function(){
    var i,a,o,p,s="Shockwave",f="Flash",t=" 2.0",u=s+" "+f,v=s+f+".",rSW=new RegExp("^"+u+" (\\d+)");
    if((o=navigator.plugins)&&(p=o[u]||o[u+t])&&(a=p.description.match(rSW)))return a[1];
    else if(!!(window.ActiveXObject))for(i=10;i>0;i--)try{if(!!(new ActiveXObject(v+v+i)))return i;}catch(e){}
    return 0;
  })();

  function Overlay(config){
    this.configure(config);

    this.$container = $(this.config.container);
    this.$hpContainer = $(this.config.hpContainer);
    this.$overlayContainer = $(this.config.overlayContainer);

    var root = this;

    if(flashver >= this.config.minFlashVer){

      this.$container.addClass('enabled');

      if(this.config.auto){
        //build overlay
        this.overlay = this.getOverlay();

        //render overlay
        this.expand();

        this.timerRunning = true;

        //set timer to remove overlay and show hp
        this.autoCloseTimer = setTimeout(function(){
          root.timerRunning = false;
          root.collapse(false);
        }, this.config.autoCloseTimeout);

      } else {
        //build halfpage
        this.hp = this.getHalfpage();
        //render halfpage
        this.renderHalfpage();
      }
    } else{
      this.renderBackupImage();
    }
  }

  Overlay.prototype = {

    configure: function(config){
      var currentConfig = this.config || defaults;
      this.config = $.extend(true, currentConfig, config);
    },

    getHalfpage: function(){
      return this.swfCode(this.config.creative.halfpage);
    },

    renderHalfpage: function(){
      this.$overlayContainer.empty();
      this.$hpContainer.html(this.hp);
    },

    getOverlay: function(){
      return this.swfCode(this.config.creative.overlay);
    },

    renderOverlay: function(){
      this.$hpContainer.empty();
      this.$overlayContainer.html(this.overlay);
    },

    getBackupImage: function(atts){
      return $('<a href="' + this.config.clickTrack + atts.clickTag[0] + '" target="_blank">' +
                '<img src="' + atts.backup + '" width="' + atts.width + '" height="' + atts.height + '" alt="Click here for more information" />' +
              '</a>');
    },

    renderBackupImage: function(){
      this.backupImage = this.backupImage || this.getBackupImage(this.config.creative.halfpage);
      this.$hpContainer.html(this.backupImage).addClass('collapsed').removeClass('expanded');
    },

    getFlashVars: function(atts){
      var cts = atts.clickTag, l = cts.length, rv = [], i;
      for(i=0; i<l; i++){
        rv.push('clickTag' + (i + 1) + '=' + this.config.clickTrackEsc + cts[i]);
      }
      return rv.join('&');
    },

    swfCode: function(atts){
      var flashvars = this.getFlashVars(atts);

      return $('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="' + atts.width + '" height="' + atts.height + '" id="' + atts.id + '" align="middle">' +
        '<param name="movie" value="' + atts.url + '" />' +
        '<param name="quality" value="high" />' +
        '<param name="bgcolor" value="#ffffff" />' +
        '<param name="play" value="true" />' +
        '<param name="loop" value="true" />' +
        '<param name="wmode" value="window" />' +
        '<param name="scale" value="showall" />' +
        '<param name="menu" value="true" />' +
        '<param name="devicefont" value="false" />' +
        '<param name="salign" value="" />' +
        '<param name="allowScriptAccess" value="always" />' +
        '<param name="flashvars" value="' + flashvars + '" />' +
        '<!--[if !IE]>-->' +
        '<object type="application/x-shockwave-flash" data="' + atts.url + '" width="' + atts.width + '" height="' + atts.height + '">' +
          '<param name="movie" value="' + atts.url + '" />' +
          '<param name="quality" value="high" />' +
          '<param name="bgcolor" value="#ffffff" />' +
          '<param name="play" value="true" />' +
          '<param name="loop" value="true" />' +
          '<param name="wmode" value="window" />' +
          '<param name="scale" value="showall" />' +
          '<param name="menu" value="true" />' +
          '<param name="devicefont" value="false" />' +
          '<param name="salign" value="" />' +
          '<param name="allowScriptAccess" value="always" />' +
          '<param name="flashvars" value="' + flashvars + '" />' +
        '</object>' +
        '<!--<![endif]-->' +
      '</object>')[0];
    },

    expand: function(click){
      click = !!click || false;

      this.overlay = this.overlay || this.getOverlay();

      this.renderOverlay();

      this.$container.removeClass('collapsed').addClass('expanded');

      if(click && this.config.tracking.expand){
        this.addPixel(this.config.tracking.expand);
      }

    },

    collapse: function(click){
      click = !!click || false;

      if(this.timerRunning){
        clearTimeout(this.autoCloseTimer);
      }

      this.hp = this.hp || this.getHalfpage();

      this.renderHalfpage();

      this.$container.removeClass('expanded').addClass('collapsed');

      if(click && this.config.tracking.collapse){
        this.addPixel(this.config.tracking.collapse);
      }

    },

    addPixel: function(url){
      url = url.replace(/\[random\]/i, Math.floor(Math.random() * 1E5));
      $('<img src="' + url + '" width="1" height="1" alt="" />').css({
        display: 'none'
      }).appendTo(this.$container);
    }

  };

  wpAd.Overlay = Overlay;

})(window.jQuery);