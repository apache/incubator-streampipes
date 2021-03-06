/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
package org.apache.streampipes.model.staticproperty;

import io.fogsy.empire.annotations.RdfProperty;
import io.fogsy.empire.annotations.RdfsClass;
import org.apache.streampipes.model.util.Cloner;
import org.apache.streampipes.vocabulary.StreamPipes;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToOne;

@RdfsClass(StreamPipes.STATIC_PROPERTY_ALTERNATIVE)
@Entity
public class StaticPropertyAlternative extends StaticProperty {

  @OneToOne(fetch = FetchType.EAGER,
          cascade = {CascadeType.ALL})
  @RdfProperty(StreamPipes.IS_SELECTED)
  private boolean selected;

  @OneToOne(fetch = FetchType.EAGER,
          cascade = {CascadeType.ALL})
  @RdfProperty(StreamPipes.HAS_STATIC_PROPERTY)
  private StaticProperty staticProperty;

  public StaticPropertyAlternative() {
    super(StaticPropertyType.StaticPropertyAlternative);
  }

  public StaticPropertyAlternative(String internalName,
                             String label, String description) {
    super(StaticPropertyType.StaticPropertyAlternative, internalName, label, description);
  }

  public StaticPropertyAlternative(StaticPropertyAlternative other) {
    super(other);
    this.selected = other.getSelected();
    if (other.getStaticProperty() != null) {
      this.staticProperty = new Cloner().staticProperty(other.getStaticProperty());
    }
  }

  public Boolean getSelected() {
    return selected;
  }

  public void setSelected(Boolean selected) {
    this.selected = selected;
  }

  public StaticProperty getStaticProperty() {
    return staticProperty;
  }

  public void setStaticProperty(StaticProperty staticProperty) {
    this.staticProperty = staticProperty;
  }

  @Override
  public void accept(StaticPropertyVisitor visitor) {
    visitor.visit(this);
  }
}
