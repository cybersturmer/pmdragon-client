package com.cybersturmer.pmdragon.pmdragonce;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import io.sentry.capacitor.SentryCapacitor;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      add(SentryCapacitor.class)
    }});

    if (BuildConfig.DEBUG) {
      EnableHttpsSelfSigned.enable(this.bridge);
    }








  }
}
