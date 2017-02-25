(
	function()
	{
		//Creamos el Sonic Loader
		var sonicLoader = new Sonic({
 
			width: 50,
			height: 50,
			padding: 50,
		 
			strokeColor: '#000',
		 
			pointDistance: .01,
			stepsPerFrame: 3,
			trailLength: .7,
		 
			step: 'fader',
		 
			setup: function() {
				this._.lineWidth = 5;
			},
		 
			path: [
				['arc', 25, 25, 25, 0, 360]
			]
		 
		});
		 
		sonicLoader.play();
		
		//Verificamos que este ejecutando GoogleChrome
		if( navigator && 
			navigator['vendor'] != undefined && 
			navigator['vendor'] != 'Google Inc.' )
		{
			alert('No se soporta ese Browser');
			return;
		}
		
		//Seteamos los path
		Ext.Loader.setConfig(
			{
				enabled: true,
				paths: {
					Ext: 'js/ext4.2.1/src',
				}
			}
		);

		//Precargamos los librerías
		Ext.require([
			'Ext.grid.*',
			'Ext.data.*',
			'Ext.panel.*'
		]);
		
		//Cargamos la aplicación
		Ext.onReady(
			function()
			{
				//Agregamos el Sonic Loader
				var container = document.getElementsByClassName('content');
				container = container[0] || null;
				
				if(container != null)
				{
					var title = document.getElementsByClassName('title');   // Get the <ul> element with id="myList"
					container.removeChild(title[0] || null);  
					container.appendChild(sonicLoader.canvas);
				}
			}
		);
		
		
		//Creamos el store
		var storeHistories = Ext.create('Ext.data.ArrayStore', {
			storeId: 'idStoreHistories',
			fields: [
				{name: 'id', type: 'number'},
				{name: 'name', type: 'string'},
				{name: 'request', type: 'string'},
				{name: 'response', type: 'string'},
				{name: 'update', type: 'date', /*dateFormat: 'n/j h:ia'*/},
			]
		});

		/*
		// little bit of feedback
		listView.on('selectionchange', function(view, nodes){
			var len = nodes.length,
				suffix = len === 1 ? '' : 's',
				str = 'Simple ListView <i>({0} item{1} selected)</i>';
				
			listView.setTitle(Ext.String.format(str, len, suffix));
		});*/
		
		var apiURL = 'api/v1/';

		Ext.application({
			requires: [
				'Ext.container.Viewport'
			],
			name: 'AppExt',
			controllers: [],
			views: [],
			appFolder: 'app/',
			launch: function ()
			{

				console.log('Argumens:', arguments);
				//Manejo del historial
				Ext.History.init();
				
				//Habilitar Cors 
				Ext.Ajax.useDefaultXhrHeader = false;
				Ext.Ajax.cors = true;
				
				//Desplegamos la aplicación
				var principalWindow = Ext.create('Ext.container.Viewport', {
					layout: 'fit',
					counterId: 0,
					items: [
						{
							layout: {
								type: 'border'
							},
							items: [
								//Grid con el historial de solicitudes
								{
									region: 'west',
									xtype: 'panel',
									id:'idGridHistories',
									width: '30%',
									collapsible: true,
									collapsed: true,
									title: 'Historial de solicitudes',
									layout:'fit',
									items:
									[
										{
											xtype: 'grid',
											store: storeHistories,
											multiSelect: false,
											columns: [
												{
													text: 'Id',
													flex: 1,
													dataIndex: 'id',
													hidden: true,
												},
												{
													text: 'Intento',
													flex: 0.2,
													dataIndex: 'name'
												},
												{
													text: 'Solicitud',
													flex: 0.3,
													dataIndex: 'request'
												},
												{
													text: 'Respuesta',
													flex: 0.3,
													dataIndex: 'response'
												},
												{
													text: 'Actualización',
													xtype: 'datecolumn',
													flex: 0.2,
													dataIndex: 'update',
													renderer: function(value, metaData, record, rowIndex , colIndex , store , view, returnHtml)
													{
														return Ext.Date.format(record.get('update'), 'H:i:s.u')
													},
												},
											],
											listeners:{
												select: function( thisGrid, record, index, eOpts )
												{
													var form = Ext.getCmp('idFormRequest').getForm();

													form.setValues(
														{
															id: record.get('id'),
															name: record.get('name'),
															request: JSON.stringify(Ext.JSON.decode(record.get('request')), null, 4),
															response: record.get('response'),
															update: record.get('update'),
														}
													);
												},
											}
										}
									]
								},
								//Formulario que hace la solicitud
								{
									region: 'center',
									xtype: 'panel',
									layout: 'fit',
									border: false,
									width: '100%',
									autoHeight: true,
									items: [
										{
											xtype: 'form',
											id: 'idFormRequest',
											url: 'cubesummations',
											layout: {
												type: 'hbox',
												pack: 'start',
												align: 'stretch'
											},
											items:[
												{
													title:'Solicitud',
													
													flex:1.5,
													layout:{
														type: 'vbox',
														pack: 'start',
														align: 'stretch'
													},
													items:[
														{
															xtype: 'hiddenfield',
															id: 'idID',
															name: 'id'
														},
														{
															xtype: 'hiddenfield',
															id: 'idDate',
															name: 'update'
														},
														{
															xtype: 'textfield',
															fieldLabel: 'Nombre',
															name: 'name',
															allowBlank: false,
															labelWidth: 46,
															padding: '5',
														},
														{
															flex: 1,
															xtype: 'textareafield',
															fieldLabel: 'Cuerpo de la Solicitud',
															labelAlign: 'top',
															labelStyle: 'padding: 0px 0px 5px 0px;',
															name: 'request',
															allowBlank: false,
															padding: '0 5 5 5',
															listeners:{
																change: function( thisField, newValue, oldValue, eOpts )
																{
																	if(newValue != '')
																	{
																		Ext.getCmp('idResponse').reset();
																	}
																}
															}
														}
													]
												},
												{
													title:'Respuesta', 
													flex: 0.5,
													layout: 'fit',
													items:[
														{
															xtype: 'textareafield',
															id: 'idResponse',
															name: 'response',
															readOnly: true, 
														}
													]
												},
											]
										}
									]
								},
								//Menú
								{
									xtype: 'toolbar',
									region: 'north',
									ui: 'footer',
									height: 40,
									items: [
										{
											xtype: 'label',
											html: [
												'<p style="font-size: 18px;font-weight: bold; padding: 0;margin: 5px 10px;">',
													'Cube Summation',
												'</p>',
											].join('')
										},
										'->',
										{
											text: 'Limpiar',
											listeners:
											{
												click: function(thisButton, e, eOpts)
												{
													var form = Ext.getCmp('idFormRequest').getForm();

													form.reset();
												}
											}
										},
										{
											text: 'Guardar en historial',
											id: 'idGuardarHistorial',
											listeners:{
												click: function(thisButton, e, eOpts)
												{
													var formPanel = Ext.getCmp('idFormRequest');
													var form = formPanel.getForm();

													if(form.isValid())
													{
														principalWindow.getEl().mask('Guardando en historial...');

														var objData = form.getValues();
														var objRequest = objData['request'] || '{}';

														//Validamos que tenga un formato JSON válido
														if( (objRequest = Ext.JSON.decode(objRequest, true)) == null)
														{
															Ext.Msg.show({
																title:'ERROR',
																msg: 'Formato: JSON inválido',
																icon: Ext.MessageBox.ERROR,
																buttons: Ext.Msg.OK,
															});
															principalWindow.getEl().unmask();
															return;
														}

														var nowDate = new Date();
														Ext.getCmp('idDate').setValue(nowDate);

														//Guardamos los datos
														if(Ext.isEmpty(objData['id']))
														{
															objData['id'] = ++principalWindow.counterId;

															storeHistories.add(
																[
																	[
																		objData['id'],
																		objData['name'],
																		objData['request'],
																		objData['response'],
																		nowDate,
																	]
																]
															);

															Ext.getCmp('idID').setValue(objData['id']);
														}
														else
														{
															var record = storeHistories.getAt(storeHistories.find('id', objData['id']));
															record.set(form.getValues());
														}

														var gridHistories = Ext.getCmp('idGridHistories');
														gridHistories.expand();

														principalWindow.getEl().unmask();
													}
												}
											}
										},
										'-',
										{
											text: 'Enviar Calculo',
											listeners:{
												click: function(thisButton, e, eOpts)
												{
													var formPanel = Ext.getCmp('idFormRequest');
													var form = formPanel.getForm();

													if(form.isValid())
													{
														principalWindow.getEl().mask('Realizando la solicitud...');

														var objData = form.getValues();
														var objRequest = objData['request'] || '{}';

														//Validamos que tenga un formato JSON válido
														if( (objRequest = Ext.JSON.decode(objRequest, true)) == null)
														{
															Ext.Msg.show({
																title:'ERROR',
																msg: 'Formato: JSON inválido',
																icon: Ext.MessageBox.ERROR,
																buttons: Ext.Msg.OK,
															});
															principalWindow.getEl().unmask();
															return;
														}
														
														//Hacemos la llamada AJAX
														Ext.Ajax.request({
															url      : apiURL + 'cubesummations',
															dataType : 'json',
															method   : 'POST',
															headers  : {
																'Content-Type': 'application/json'
															},
															jsonData: objRequest,
															success  : function(response)
															{
																var objResp = Ext.decode(response.responseText);

																principalWindow.getEl().unmask();
																
																Ext.Msg.show({
																	title:'Calculo &Eacute;xitoso',
																	msg: objResp['msg'],
																	icon: Ext.MessageBox.INFO,
																	buttons: Ext.Msg.OK,
																});

																//Guardamos los datos
																var formatData = objResp['data'];
																var strResponse = '[\n';

																if(!Ext.isEmpty(formatData))
																{

																	//Agregamos salto de linea
																	for(var i=0; i<formatData.length; ++i)
																	{
																		strResponse += '  ' + formatData[i] + '\n'; 
																	}
																}
																
																strResponse += ']';

																Ext.getCmp('idResponse').setValue(strResponse);

																//Como fue exitoso lo guardamos automaticamente
																var buttonGuardarHistorial = Ext.getCmp('idGuardarHistorial');
																buttonGuardarHistorial.fireEvent('click', [buttonGuardarHistorial, null, null] ) ;
																
															},
															failure  : function(response)
															{
																var objResp = Ext.decode(response.responseText);

																principalWindow.getEl().unmask();

																Ext.Msg.show({
																	title:'Calculo Erroneo',
																	msg: objResp['msg'],
																	icon: Ext.MessageBox.ERROR,
																	buttons: Ext.Msg.OK,
																});
															}
														});

													}
												}
											}
										}
									]
								},
								//Footer
								{
									region: 'south',
									xtype: 'label',
									padding: '5 10',
									html: [
										'<div style="padding: 5 10;">',
											'<div style="float:left;">',
												'Version ' + PVersion,
											'</div>',
											'<div style="float:right;">',
												'Desarrollado por ',
												'<a href="http://pcaicedo.com" target="_black" style="text-decoration: none;">',
													'Pedro Caicedo',
												'</a>',
											'</div>',
										'</div>',
									].join(''),
								},
							]
						}
					],
					listeners:{
						beforerender: function ( thisViewport, eOpts )
						{
							var container = document.getElementsByClassName('container');
							document.body.removeChild(container[0] || null);  
						}
					}
				});

			}
		});
	}
).call(this);
