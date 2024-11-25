package com.axonivy.wf.custom;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import ch.ivyteam.ivy.process.eventstart.AbstractProcessStartEventBean;
import ch.ivyteam.ivy.process.extension.ui.ExtensionUiBuilder;
import ch.ivyteam.ivy.process.extension.ui.IUiFieldEditor;
import ch.ivyteam.ivy.process.extension.ui.UiEditorExtension;
import ch.ivyteam.ivy.request.RequestException;
import ch.ivyteam.util.PropertiesUtil;

public class ErpInvoice extends AbstractProcessStartEventBean {

  public ErpInvoice() {
    super("ErpInvoice", "Integrates ERP updates driven by CSV files");
  }

  @Override
  public void poll() {
    Properties configs = PropertiesUtil.createProperties(getConfiguration());
    int seconds = Integer.parseInt(configs.getProperty(Config.INTERVAL, "60"));
    getEventBeanRuntime().setPollTimeInterval(TimeUnit.SECONDS.toMillis(seconds));

    String path = configs.getProperty(Config.PATH, "");
    try (Stream<Path> csv = Files.list(Path.of(path))) {
      List<Path> updates = csv.collect(Collectors.toList());
      startProcess("new stock items", Map.of("sheets", updates));
    } catch (IOException ex) {
      getEventBeanRuntime().getRuntimeLogLogger().error("Failed to check ERP for updates", ex);
    }
  }

  private void startProcess(String firingReason, Map<String, Object> parameters) {
    try {
      getEventBeanRuntime().fireProcessStartEventRequest(null, firingReason, parameters);
    } catch (RequestException ex) {
      getEventBeanRuntime().getRuntimeLogLogger().error("Failed to init ERP driven proces", ex);
    }
  }

  public static class Editor extends UiEditorExtension {

    private IUiFieldEditor path;
    private IUiFieldEditor interval;

    @Override
    public void initUiFields(ExtensionUiBuilder ui) {
      ui.label("Path to read .CSV stock-item changes:").create();
      path = ui.textField().create();

      ui.label("Interval in seconds to check for changes:").create();
      interval = ui.scriptField().requireType(Integer.class).create();
    }

    @Override
    protected void loadUiDataFromConfiguration() {
      path.setText(getBeanConfigurationProperty(Config.PATH));
      interval.setText(getBeanConfigurationProperty(Config.INTERVAL));
    }

    @Override
    protected boolean saveUiDataToConfiguration() {
      clearBeanConfiguration();
      setBeanConfigurationProperty(Config.PATH, path.getText());
      setBeanConfigurationProperty(Config.INTERVAL, interval.getText());
      return true;
    }
  }

  private interface Config {
    String PATH = "path";
    String INTERVAL = "interval";
  }

}
