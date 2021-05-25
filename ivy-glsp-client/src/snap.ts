/********************************************************************************
 * Copyright (c) 2020 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { SShapeElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { ISnapper, Point, SModelElement } from 'sprotty';

@injectable()
export class IvyGridSnapper implements ISnapper {
    get gridX(): number {
        return 8;
    }

    get gridY(): number {
        return 8;
    }

    snap(position: Point, element: SModelElement): Point {
        let width = 0;
        let height = 0;
        if (element instanceof SShapeElement) {
            width = element.size.width / 2;
            height = element.size.height / 2;
        }
        return {
            x: Math.round((position.x + width) / this.gridX) * this.gridX - width,
            y: Math.round((position.y + height) / this.gridY) * this.gridY - height
        };
    }
}
