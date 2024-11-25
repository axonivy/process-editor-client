package com.axonivy.erp;

import ch.ivyteam.ivy.scripting.objects.File;

public interface ErpFileService {

  public static ErpFileService instance() {
    return null;
  }

  public void reportStats(File stats);

}
